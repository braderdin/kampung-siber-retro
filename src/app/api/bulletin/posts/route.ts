import { NextRequest, NextResponse } from 'next/server';

interface BulletinPost {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  priority?: 'low' | 'medium' | 'high';
  isPinned?: boolean;
}

// Sample bulletin posts stored in memory
const samplePosts: BulletinPost[] = [
  {
    id: '1',
    title: 'Selamat datang ke Pangkalan Notis Kampung Siber!',
    author: 'Pejabat Kampung',
    content: 'Komuniti kini aktif! Sertai perbincangan dan kongsi idea anda.',
    createdAt: new Date().toISOString(),
    priority: 'high',
    isPinned: true
  },
  {
    id: '2',
    title: 'Kemaskini Platform Retro',
    author: 'Penyelenggara',
    content: 'Antaramuka retro baharu kini diluncurkan. Elakkan idea 1990-an ini!',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Arkib Arcade Diperbaharui',
    author: 'Pentadbir Arcade',
    content: 'Dua lagi game retro telah ditambah: Retro Pong dan Retro Snake',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    priority: 'low'
  }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      posts: samplePosts,
      total: samplePosts.length
    });
  } catch (error) {
    console.error('Error fetching bulletin posts:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mendapatkan pemberitahuan' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, content, priority } = body;
    
    if (!title || !author || !content) {
      return NextResponse.json(
        { success: false, error: 'Medan wajib tidak lengkap' },
        { status: 400 }
      );
    }

    const newPost: BulletinPost = {
      id: Date.now().toString(),
      title,
      author,
      content,
      createdAt: new Date().toISOString(),
      priority: priority || 'low',
      isPinned: false
    };

    samplePosts.unshift(newPost);
    
    return NextResponse.json({
      success: true,
      post: newPost
    });
  } catch (error) {
    console.error('Error creating bulletin post:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mewujudkan pemberitahuan' },
      { status: 500 }
    );
  }
}