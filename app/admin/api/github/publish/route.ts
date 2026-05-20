import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { Octokit } from 'octokit';
import { PageData } from '@/lib/editor/useEditorStore';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'Dracarnix/nextjs-commerce';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    const { pages } = await request.json();

    if (!pages || !Array.isArray(pages)) {
      return NextResponse.json(
        { error: 'Invalid pages data' },
        { status: 400 }
      );
    }

    const [owner, repo] = GITHUB_REPO.split('/');

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Invalid GITHUB_REPO configuration' },
        { status: 500 }
      );
    }

    // Initialize Octokit
    const octokit = new Octokit({
      auth: GITHUB_TOKEN,
    });

    // Get the current commit SHA for the main branch
    let mainBranchSha: string;
    try {
      const refResponse = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: 'heads/main',
      });
      mainBranchSha = refResponse.data.object.sha;
    } catch (error) {
      // Try master branch if main doesn't exist
      const refResponse = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: 'heads/master',
      });
      mainBranchSha = refResponse.data.object.sha;
    }

    // Get the tree of the current commit
    const treeResponse = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: mainBranchSha,
      recursive: 'true',
    });

    // Prepare the pages.json file content
    const pagesContent = JSON.stringify({ pages }, null, 2);
    const encodedContent = Buffer.from(pagesContent).toString('base64');

    // Create blob for pages.json
    const blobResponse = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: encodedContent,
      encoding: 'base64',
    });

    // Create new tree with updated pages.json
    const newTreeItems: any[] = treeResponse.data.tree
      .filter((item) => item.path !== 'public/editor-data/pages.json')
      .map((item) => ({
        path: item.path,
        mode: item.mode,
        type: item.type,
        sha: item.sha,
      }));

    newTreeItems.push({
      path: 'public/editor-data/pages.json',
      mode: '100644',
      type: 'blob',
      sha: blobResponse.data.sha,
    });

    const newTree = await octokit.rest.git.createTree({
      owner,
      repo,
      tree: newTreeItems,
      base_tree: mainBranchSha,
    });

    // Create commit
    const commitResponse = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: `[v0 Editor] Update pages layout - ${new Date().toLocaleString()}`,
      tree: newTree.data.sha,
      parents: [mainBranchSha],
    });

    // Update the main branch to point to the new commit
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: 'heads/main',
      sha: commitResponse.data.sha,
    });

    return NextResponse.json({
      success: true,
      message: 'Published to GitHub successfully',
      commitSha: commitResponse.data.sha,
    });
  } catch (error) {
    console.error('GitHub publish error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to publish: ${errorMessage}` },
      { status: 500 }
    );
  }
}
