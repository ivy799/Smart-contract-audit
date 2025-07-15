import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
  {
    name: "Yusra Erlangga Putra",
    username: "@yusraer",
    body: "Platform audit smart contract terbaik yang pernah saya gunakan. Sangat membantu mengidentifikasi kerentanan keamanan.",
    img: "https://avatars.githubusercontent.com/u/143472196?v=4",
  },
  {
    name: "Innocentia",
    username: "@innocentia",
    body: "Audit yang sangat detail dan komprehensif. Tim saya merasa lebih aman setelah menggunakan layanan ini.",
    img: "https://1nnocentia.github.io/assets/img/Me1.jpg",
  },
  {
    name: "Muhammad Raihan",
    username: "@ivy799",
    body: "Laporan audit yang diberikan sangat mudah dipahami dan actionable. Highly recommended!",
    img: "https://ivy799.github.io/Pas%20Foto.jpg",
  },
  {
    name: "Maya Kusuma",
    username: "@mayakusuma",
    body: "Proses audit yang cepat dan thorough. Smart contract kami sekarang jauh lebih secure.",
    img: "https://avatar.vercel.sh/maya",
  },
  {
    name: "Ricky Harahap",
    username: "@rickyharahap",
    body: "Tool audit yang sangat powerful dengan interface yang user-friendly. Sangat membantu developer seperti saya.",
    img: "https://avatar.vercel.sh/ricky",
  },
  {
    name: "Diana Putri",
    username: "@dianaputri",
    body: "Pelayanan audit smart contract yang profesional dan terpercaya. Hasil auditnya sangat memuaskan.",
    img: "https://avatar.vercel.sh/diana",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse={true} pauseOnHover={true} className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
