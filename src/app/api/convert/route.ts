import fs from "fs";
import path from "path";
import csv from "csvtojson";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("file") || "products-2000000.csv";

    const inputPath = path.join(process.cwd(), "public", "csv", filename);
    const outputFilename = filename.replace(".csv", ".json");
    const outputPath = path.join(
      process.cwd(),
      "public",
      "json",
      outputFilename,
    );

    if (!fs.existsSync(inputPath)) {
      return NextResponse.json(
        { error: `File not found: ${filename}` },
        { status: 404 },
      );
    }

    const writeStream = fs.createWriteStream(outputPath);
    writeStream.write("[");
    let isFirst = true;

    await new Promise<void>((resolve, reject) => {
      (csv as any)({
        constructResult: false, // memory efficient
      })
        .fromFile(inputPath)
        .subscribe(
          (jsonObj: any) => {
            if (!isFirst) {
              writeStream.write(",");
            }
            writeStream.write(JSON.stringify(jsonObj));
            isFirst = false;
          },
          (err: Error) => {
            console.error(err);
            reject(err);
          },
          () => {
            writeStream.write("]");
            writeStream.end();
            console.log(
              `Conversion finished: ${filename} -> ${outputFilename}`,
            );
            resolve();
          },
        );
    });

    return NextResponse.json({
      message: "Conversion completed",
      source: filename,
      output: `public/json/${outputFilename}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
