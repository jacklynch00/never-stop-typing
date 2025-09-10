import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const sessions = await prisma.writingSession.findMany({
      where: {
        userId,
        completed: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to last 50 sessions
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching writing sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch writing sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      title,
      content,
      wordCount,
      durationSeconds,
      topicCategory,
      difficultyMode,
    } = body;

    if (!userId || !content || wordCount === undefined || durationSeconds === undefined || !difficultyMode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await prisma.writingSession.create({
      data: {
        userId,
        title,
        content,
        wordCount,
        durationSeconds,
        topicCategory,
        difficultyMode,
        completed: true,
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error creating writing session:', error);
    return NextResponse.json(
      { error: 'Failed to create writing session' },
      { status: 500 }
    );
  }
}