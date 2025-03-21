import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// 排除不需要身份驗證的路徑
const publicPaths = ["/login", "/error", "/api/auth"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 檢查是否為公開路徑
  const isPublicPath = publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith(publicPath + "/")
  );

  // 如果是公開路徑，直接允許訪問
  if (isPublicPath) {
    return NextResponse.next();
  }

  try {
    // 檢查使用者會話狀態 (token 包含會話資訊)
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || process.env.SECRET,
      secureCookie: process.env.NODE_ENV === "production",
      cookieName: "next-auth.session-token", // 確保使用正確的 cookie 名稱
    });

    // 如果沒有有效的會話（未登入），重定向到登入頁面
    if (!token) {
      console.log("未檢測到有效會話，重定向到登入頁面");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 已登入，允許訪問
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware 錯誤:", error);
    return NextResponse.redirect(new URL("/error", req.url));
  }
}

// 配置中間件適用的路徑
export const config = {
  matcher: [
    // 排除不需要檢查的靜態資源或特定API路徑
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
