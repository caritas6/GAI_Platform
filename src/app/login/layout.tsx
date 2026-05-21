// 로그인 페이지는 Nav, AuthGuard 없이 독립적으로 렌더링
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
