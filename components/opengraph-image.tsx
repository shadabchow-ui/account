import { ImageResponse } from "next/og";
import { join } from "path";
import { readFile } from "fs/promises";

export type Props = {
  title?: string;
};

export default async function OpengraphImage(
  props?: Props,
): Promise<ImageResponse> {
  const { title = "Upcube Account" } = props ?? {};
  const file = await readFile(join(process.cwd(), "./fonts/Inter-Bold.ttf"));
  const font = Uint8Array.from(file).buffer;

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-[#0f0f10] text-white">
        <div tw="flex flex-col rounded-3xl border border-[#ffffff1a] bg-[#1f2023] px-12 py-10">
          <p tw="m-0 text-2xl text-[#a1a1aa]">Upcube</p>
          <p tw="m-0 mt-2 text-6xl font-bold">{title}</p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Inter", data: font, style: "normal", weight: 700 }],
    },
  );
}
