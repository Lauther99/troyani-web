import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
  dark?: boolean;
};

export default function Breadcrumb({ items, dark = false }: Props) {
  return (
    <nav
      aria-label="Ruta de navegación"
      className={`text-xs md:text-sm font-medium ${
        dark ? "text-[#8fc0f0]/80" : "text-[#5b7083]"
      }`}
    >
      <ol className="flex flex-wrap items-center gap-1.5 md:gap-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5 md:gap-2">
              {idx > 0 && (
                <span
                  aria-hidden="true"
                  className={dark ? "text-[#8fc0f0]/40" : "text-[#a3b1bd]"}
                >
                  ›
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`transition-colors duration-150 ease-out ${
                    dark ? "text-[#8fc0f0]/80 hover:text-white" : "hover:text-[#0e1f2e]"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={`truncate max-w-[240px] sm:max-w-none ${
                    isLast
                      ? dark
                        ? "font-semibold text-white"
                        : "font-semibold text-[#0e1f2e]"
                      : undefined
                  }`}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
