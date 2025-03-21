import Link from "next/link";
import { usePathname } from "next/navigation";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "仪表板", href: "/dashboard" },
    { name: "小组", href: "/groups" },
    { name: "活动", href: "/events" },
    { name: "消息", href: "/messages" },
  ];

  const userNavigation = [
    { name: "个人资料", href: "/profile" },
    { name: "设置", href: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <a
                  href="/"
                  className="text-2xl font-bold text-primary"
                >
                  HappyMeet
                </a>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  href="/dashboard"
                  className="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium border-primary text-gray-900"
                >
                  仪表板
                </a>
                <a
                  href="/groups" 
                  className="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  小组
                </a>
                <a
                  href="/events"
                  className="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  活动
                </a>
                <a
                  href="/messages"
                  className="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  消息
                </a>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative ml-3">
                <div className="flex items-center">
                  <span className="mr-4 text-sm text-gray-700">
                    用户
                  </span>
                  <div className="relative">
                    <a
                      href="/profile"
                      className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <span className="sr-only">用户菜单</span>
                      <div className="h-8 w-8 rounded-full bg-gray-200 text-center leading-8">
                        U
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">打开主菜单</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                  pathname === item.href
                    ? "border-primary bg-primary-50 text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 text-center text-lg leading-10">
                  U
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  用户
                </div>
                <div className="text-sm font-medium text-gray-500">
                  user@example.com
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {userNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">{children}</main>
    </div>
  );
} 