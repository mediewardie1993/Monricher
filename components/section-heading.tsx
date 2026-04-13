import { Reveal } from "@/components/reveal";

type SectionHeadingProps = {
  kicker: string;
  title: string;
  text?: string;
  align?: "center" | "left";
};

export function SectionHeading({ kicker, title, text, align = "center" }: SectionHeadingProps) {
  return (
    <Reveal className={align === "left" ? "max-w-2xl" : "mx-auto max-w-3xl text-center"}>
      <span className="section-kicker">{kicker}</span>
      <h2 className="text-balance text-[2rem] font-bold leading-tight text-white md:text-5xl">{title}</h2>
      {text ? (
        <p className="mt-4 text-base leading-7 text-muted md:mt-5 md:text-lg md:leading-8">{text}</p>
      ) : null}
    </Reveal>
  );
}
