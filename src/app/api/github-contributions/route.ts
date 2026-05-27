import { NextResponse } from 'next/server';

export interface ContribDay {
  date: string;  // 'YYYY-MM-DD'
  level: number; // 0-4
}

/**
 * Fetches MananJain525's public GitHub contribution calendar.
 * GitHub exposes a public HTML fragment at /users/<name>/contributions
 * that contains SVG rect elements with data-date and data-level attrs.
 *
 * Response is cached for 1 hour at the Next.js layer.
 */
export async function GET() {
  try {
    const res = await fetch(
      'https://github.com/users/MananJain525/contributions',
      {
        headers: {
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          // Mimic a browser so GitHub doesn't block the request
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest',
        },
        // Cache at the Next.js fetch layer — revalidate every hour
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { days: [], error: `GitHub returned ${res.status}` },
        { status: 200 },
      );
    }

    const html = await res.text();
    const days: ContribDay[] = [];

    // Walk every <rect …> element and extract data-date / data-level
    const rectRe = /<rect[^>]+>/g;
    let m: RegExpExecArray | null;
    while ((m = rectRe.exec(html)) !== null) {
      const el = m[0];
      const dateM = /data-date="(\d{4}-\d{2}-\d{2})"/.exec(el);
      const lvlM = /data-level="(\d)"/.exec(el);
      if (dateM && lvlM) {
        days.push({ date: dateM[1], level: parseInt(lvlM[1], 10) });
      }
    }

    if (days.length === 0) {
      return NextResponse.json({ days: [], error: 'no rect elements found' });
    }

    // Sort ascending by date, keep last 60 consecutive days
    days.sort((a, b) => a.date.localeCompare(b.date));
    const last60 = days.slice(-60);

    return NextResponse.json({ days: last60 });
  } catch (err) {
    return NextResponse.json(
      { days: [], error: err instanceof Error ? err.message : String(err) },
      { status: 200 },
    );
  }
}
