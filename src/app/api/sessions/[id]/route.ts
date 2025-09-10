import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, wordCount, durationSeconds, topicCategory } = body;

    const session = await prisma.writingSession.update({
      where: { id },
      data: {
        title,
        content,
        wordCount,
        durationSeconds,
        topicCategory,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error updating writing session:', error);
    return NextResponse.json(
      { error: 'Failed to update writing session' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.writingSession.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting writing session:', error);
    return NextResponse.json(
      { error: 'Failed to delete writing session' },
      { status: 500 }
    );
  }
}