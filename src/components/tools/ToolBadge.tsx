import Link from 'next/link';

const TOOL_COLORS: Record<string, string> = {
  Cursor: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  v0: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Bolt: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  Lovable: 'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  Claude: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  ChatGPT: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  Replit: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Windsurf: 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
  Copilot: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  Midjourney: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
};

function getSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export function ToolBadge({ name, linked = true }: { name: string; linked?: boolean }) {
  const colorClass = TOOL_COLORS[name] || 'bg-mbogray-100 dark:bg-mbogray-800 text-mbogray-600 dark:text-mbogray-400';
  const classes = `inline-block text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`;

  if (linked) {
    return (
      <Link href={`/tools/${getSlug(name)}`} className={`${classes} hover:opacity-80 transition-opacity`}>
        {name}
      </Link>
    );
  }

  return <span className={classes}>{name}</span>;
}
