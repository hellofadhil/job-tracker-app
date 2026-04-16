import { cookies } from 'next/headers'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  defaultLocale,
  localeCookieName,
  normalizeLocale,
  tFor,
  type Locale,
} from '@/lib/i18n'

type Tip = {
  title: string
  summary: string
  points: string[]
}

function getResourcesContent(locale: Locale) {
  if (locale === 'id') {
    return {
      jobSearchTips: [
        {
          title: 'Pilih role dengan ownership yang jelas',
          summary:
            'Prioritaskan lowongan yang menjelaskan apa yang akan kamu pegang, bukan cuma daftar tools panjang.',
          points: [
            'Cari output yang nyata: fitur yang dikirim, metrik yang dipegang, user yang dilayani, atau sistem yang dijaga.',
            'Kalimat samar seperti "handle apa pun yang dibutuhkan" sering jadi tanda role-nya belum scoped dengan rapi.',
            'Kalau satu role mencampur terlalu banyak disiplin, siap-siap context switching tinggi dan growth focus yang lemah.',
          ],
        },
        {
          title: 'Bedakan must-have dan nice-to-have',
          summary:
            'Jangan menolak diri sendiri hanya karena tidak cocok di semua bullet point.',
          points: [
            'Apply kalau kamu cocok sekitar 60-70% untuk requirement praktis dan bisa jelaskan transfer value-mu.',
            'Core stack, bahasa komunikasi, dan legal kerja biasanya lebih penting daripada semua tool tambahan.',
            'Kalau list requirement sangat panjang tapi outcome role-nya sederhana, tim hiring bisa jadi belum tahu kebutuhan utamanya.',
          ],
        },
        {
          title: 'Waspadai red flags dari job post',
          summary:
            'Beberapa posting lowongan sudah menunjukkan masalah proses sejak awal.',
          points: [
            'Salary tidak jelas, reporting line tidak jelas, dan seniority kabur sering berujung ekspektasi yang tidak cocok.',
            'Buzzword yang berulang tanpa tanggung jawab konkret biasanya menandakan alignment hiring yang lemah.',
            'Kalau post terasa terlalu generik, kemungkinan proses interview-nya juga kurang rapi.',
          ],
        },
      ] satisfies Tip[],
      interviewTips: [
        {
          title: 'Siapkan perkenalan diri yang ringkas',
          summary:
            '60-90 detik pertama harus langsung menunjukkan relevansimu.',
          points: [
            'Mulai dari levelmu sekarang, domain terkuatmu, dan jenis masalah yang paling baik kamu selesaikan.',
            'Sebut 1-2 contoh konkret yang relevan dengan role, bukan menceritakan semua perjalanan kariermu.',
            'Tutup dengan alasan kenapa role ini cocok dengan arahmu sekarang.',
          ],
        },
        {
          title: 'Riset company sebelum interview',
          summary:
            'Persiapan interview yang bagus biasanya dimulai dari riset company yang bagus.',
          points: [
            'Pahami produk, user, model bisnis, dan di mana role ini kemungkinan memberi impact.',
            'Cek job post, website company, LinkedIn page, dan update produk terbaru.',
            'Siapkan 3 pertanyaan cerdas soal tujuan tim, metrik sukses, dan cara kolaborasi.',
          ],
        },
        {
          title: 'Jawab dengan struktur, bukan rambling',
          summary:
            'Interviewer lebih mudah ingat pola pikir yang rapi daripada jawaban yang panjang.',
          points: [
            'Pakai alur sederhana: konteks, aksi, hasil, dan pelajaran.',
            'Kalau tidak tahu sesuatu, jelaskan arah berpikirmu daripada diam atau panik.',
            'Untuk jawaban teknikal, tetap konkret: tools yang dipakai, tradeoff yang diambil, dan outcome yang dicapai.',
          ],
        },
      ] satisfies Tip[],
      offerTips: [
        {
          title: 'Follow-up tanpa terdengar pasif',
          summary:
            'Follow-up yang bagus itu singkat, spesifik, dan mudah dijawab recruiter.',
          points: [
            'Sebutkan tahap interview atau tanggal terakhir supaya recruiter langsung punya konteks.',
            'Minta kejelasan timeline, bukan menuntut keputusan.',
            'Kalau kamu masih tertarik, sampaikan dengan jelas dan profesional.',
          ],
        },
        {
          title: 'Nilai offer sebagai satu paket',
          summary:
            'Gaji penting, tapi scope, stabilitas, growth, dan kualitas manager juga sama pentingnya.',
          points: [
            'Cek ekspektasi role, probation, cuti, dukungan alat kerja, dan work model.',
            'Bandingkan role dengan arah jangka panjangmu, bukan hanya angka tertinggi jangka pendek.',
            'Kalau ada hal yang samar di offer, klarifikasi sebelum accept.',
          ],
        },
        {
          title: 'Negosiasi pakai bukti, bukan emosi',
          summary:
            'Negosiasi lebih efektif kalau kamu anchor ke value dan konteks market.',
          points: [
            'Jelaskan expected range-mu berdasarkan scope, pengalaman, dan kondisi market.',
            'Jaga tone tetap kolaboratif: kamu mencari alignment, bukan konflik.',
            'Kalau salary tidak bisa bergerak, tanya opsi lain seperti title, review cycle, atau fleksibilitas.',
          ],
        },
      ] satisfies Tip[],
      sections: {
        jobSearch: 'Memilih Pekerjaan',
        interview: 'Persiapan Interview',
        offer: 'Offer & Follow-up',
      },
    }
  }

  return {
    jobSearchTips: [
      {
        title: 'Choose roles with clear ownership',
        summary:
          'Prioritize job descriptions that explain what you will own, not just a long list of tools.',
        points: [
          'Look for real output: features shipped, metrics owned, customers served, or systems maintained.',
          'Treat vague phrases like "handle anything needed" as a sign the role may be under-scoped or chaotic.',
          'If the role blends too many unrelated disciplines, expect context switching and weak growth focus.',
        ],
      },
      {
        title: 'Filter must-have vs nice-to-have requirements',
        summary:
          'Do not reject yourself just because you miss a few bullet points.',
        points: [
          'Apply if you match roughly 60-70% of the practical requirements and can explain your transfer value.',
          'Core stack, communication language, and work authorization usually matter more than every optional tool listed.',
          'If the requirement list is huge but the outcome is simple, the hiring team may not know what they actually need.',
        ],
      },
      {
        title: 'Watch for red flags in job posts',
        summary:
          'Some postings reveal process problems before you even apply.',
        points: [
          'Unclear salary, unclear reporting line, and vague seniority often lead to mismatched expectations.',
          'Repeated buzzwords without concrete responsibilities usually signal weak hiring alignment.',
          'If the post feels copied and generic, expect a slower or less thoughtful interview process.',
        ],
      },
    ] satisfies Tip[],
    interviewTips: [
      {
        title: 'Prepare a tight self-introduction',
        summary:
          'Your first 60-90 seconds should establish relevance fast.',
        points: [
          'Start with your current level, strongest domain, and the type of problems you solve best.',
          'Mention 1-2 concrete examples that match the role instead of telling your full life story.',
          'End with why this specific role fits your direction right now.',
        ],
      },
      {
        title: 'Research the company before the call',
        summary:
          'Strong interview prep is usually strong company prep.',
        points: [
          'Understand the product, users, business model, and where this role likely creates impact.',
          'Check the job post, company site, LinkedIn page, and recent product launches.',
          'Prepare 3 smart questions about team goals, success metrics, and collaboration style.',
        ],
      },
      {
        title: 'Answer with structure, not raw rambling',
        summary:
          'Interviewers remember structured thinking more than long answers.',
        points: [
          'Use a simple flow: context, action, result, and what you learned.',
          'When you do not know something, explain your reasoning path instead of freezing.',
          'Keep technical answers concrete: tools used, tradeoffs made, and outcome achieved.',
        ],
      },
    ] satisfies Tip[],
    offerTips: [
      {
        title: 'Follow up without sounding passive',
        summary:
          'A good follow-up is short, specific, and easy to answer.',
        points: [
          'Reference the exact interview stage or date so the recruiter has context immediately.',
          'Ask for timeline clarity instead of demanding a decision.',
          'If you are still interested, say so clearly and professionally.',
        ],
      },
      {
        title: 'Evaluate the offer as a package',
        summary:
          'Salary matters, but so do scope, stability, growth, and manager quality.',
        points: [
          'Check role expectations, probation terms, leave policy, equipment support, and work model.',
          'Compare the role to your long-term direction, not just the highest short-term number.',
          'If something is vague in the offer, clarify before accepting.',
        ],
      },
      {
        title: 'Negotiate with evidence, not emotion',
        summary:
          'Negotiation works better when you anchor on value and market context.',
        points: [
          'Explain your expected range using scope, experience, and current market reality.',
          'Keep the tone collaborative: you want alignment, not conflict.',
          'If salary cannot move, ask about other levers like title, review cycle, or flexibility.',
        ],
      },
    ] satisfies Tip[],
    sections: {
      jobSearch: 'Choosing Jobs',
      interview: 'Interview Prep',
      offer: 'Offer & Follow-up',
    },
  }
}

function TipAccordion({
  title,
  summary,
  points,
}: Tip) {
  return (
    <AccordionItem
      value={title}
      className="rounded-2xl border border-border/70 bg-background/70 px-4 dark:border-white/[0.05] dark:bg-[#141414]"
    >
      <AccordionTrigger className="text-left text-base font-medium">
        {title}
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        <p className="text-sm text-muted-foreground">{summary}</p>
        <div className="mt-4 grid gap-2">
          {points.map((point) => (
            <div key={point} className="rounded-xl bg-muted/30 px-3 py-2 text-sm">
              {point}
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default async function ResourcesPage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(localeCookieName)?.value ?? defaultLocale,
  )
  const content = getResourcesContent(locale)

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  {tFor(locale, 'common.dashboard')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{tFor(locale, 'common.resources')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-6 p-6">
        <div className="rounded-3xl border border-border bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_30%),linear-gradient(135deg,hsl(var(--card))_0%,hsl(var(--muted)/0.7)_100%)] p-6 shadow-sm dark:border-white/[0.04] dark:bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_28%),linear-gradient(135deg,rgba(30,33,46,0.94)_0%,rgba(17,17,19,0.98)_78%)] dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.18)]">
          <div className="inline-flex rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium tracking-wide text-primary dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-blue-300">
            {tFor(locale, 'resources.badge')}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            {tFor(locale, 'resources.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            {tFor(locale, 'resources.description')}
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="border-border shadow-sm dark:border-white/[0.04] dark:bg-[#181818]">
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                {tFor(locale, 'resources.jobSearch')}
              </Badge>
              <CardTitle className="text-xl">{tFor(locale, 'resources.jobSearch')}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {tFor(locale, 'resources.jobSearchDescription')}
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm dark:border-white/[0.04] dark:bg-[#181818]">
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                {tFor(locale, 'resources.interview')}
              </Badge>
              <CardTitle className="text-xl">{tFor(locale, 'resources.interview')}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {tFor(locale, 'resources.interviewDescription')}
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm dark:border-white/[0.04] dark:bg-[#181818]">
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                {tFor(locale, 'resources.offer')}
              </Badge>
              <CardTitle className="text-xl">{tFor(locale, 'resources.offer')}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {tFor(locale, 'resources.offerDescription')}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="border-border shadow-sm dark:border-white/[0.04] dark:bg-[#181818]">
            <CardHeader>
              <CardTitle>{content.sections.jobSearch}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="grid gap-3">
                {content.jobSearchTips.map((tip) => (
                  <TipAccordion key={tip.title} {...tip} />
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm dark:border-white/[0.04] dark:bg-[#181818]">
            <CardHeader>
              <CardTitle>{content.sections.interview}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="grid gap-3">
                {content.interviewTips.map((tip) => (
                  <TipAccordion key={tip.title} {...tip} />
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm dark:border-white/[0.04] dark:bg-[#181818]">
            <CardHeader>
              <CardTitle>{content.sections.offer}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="grid gap-3">
                {content.offerTips.map((tip) => (
                  <TipAccordion key={tip.title} {...tip} />
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
