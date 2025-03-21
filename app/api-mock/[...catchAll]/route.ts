import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    status: "success", 
    message: "API在演示模式下被禁用",
    data: null 
  });
}

export async function POST() {
  return NextResponse.json({ 
    status: "success", 
    message: "API在演示模式下被禁用",
    data: null 
  });
}

export async function PUT() {
  return NextResponse.json({ 
    status: "success", 
    message: "API在演示模式下被禁用",
    data: null 
  });
}

export async function PATCH() {
  return NextResponse.json({ 
    status: "success", 
    message: "API在演示模式下被禁用",
    data: null 
  });
}

export async function DELETE() {
  return NextResponse.json({ 
    status: "success", 
    message: "API在演示模式下被禁用",
    data: null 
  });
} 