import type { ReactNode } from 'react';

type CardProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footer?: ReactNode;
  footerClassName?: string;
};

const classNames = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(' ');

export default function Card({
  title,
  description,
  actions,
  children,
  className,
  headerClassName,
  bodyClassName,
  footer,
  footerClassName,
}: CardProps) {
  const hasHeader = Boolean(title || description || actions);

  return (
    <div
      className={classNames(
        'rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]',
        className,
      )}
    >
      {hasHeader && (
        <div
          className={classNames(
            'flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-800',
            headerClassName,
          )}
        >
          <div>
            {title && (
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}

      <div className={classNames('p-5 md:p-6', bodyClassName)}>{children}</div>

      {footer && (
        <div
          className={classNames(
            'border-t border-gray-200 px-6 py-4 dark:border-gray-800',
            footerClassName,
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
