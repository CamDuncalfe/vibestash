import Link from 'next/link';

const TOOL_COLORS: Record<string, string> = {
  Cursor: 'bg-purple-50 text-purple-700',
  v0: 'bg-blue-50 text-blue-700',
  Bolt: 'bg-yellow-50 text-yellow-700',
  Lovable: 'bg-pink-50 text-pink-700',
  Claude: 'bg-orange-50 text-orange-700',
  ChatGPT: 'bg-green-50 text-green-700',
  Replit: 'bg-blue-50 text-blue-700',
  Windsurf: 'bg-teal-50 text-teal-700',
  Copilot: 'bg-gray-100 text-gray-700',
  Midjourney: 'bg-indigo-50 text-indigo-700',
};

function getSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export function ToolBadge({ name, linked = true }: { name: string; linked?: boolean }) {
  const colorClass = TOOL_COLORS[name] || 'bg-gray-100 text-gray-600';
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
