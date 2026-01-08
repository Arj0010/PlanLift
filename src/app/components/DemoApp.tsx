'use client';

import React, { useState, DragEvent } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2, RotateCw } from "lucide-react";
import { postForm } from "../lib/api";

const Feature = ({ title, desc }: { title: string; desc: string }) => (
  <div className="p-5 rounded-2xl shadow-sm bg-neutral-900 border border-neutral-800">
    <div className="font-semibold text-lg mb-1 text-neutral-100">{title}</div>
    <div className="text-sm text-neutral-400 leading-relaxed">{desc}</div>
  </div>
);

const Step = ({ n, title, desc }: { n: number; title: string; desc: string }) => (
  <div className="flex gap-3 items-start">
    <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-900 flex items-center justify-center font-bold">{n}</div>
    <div>
      <div className="font-semibold text-neutral-100">{title}</div>
      <div className="text-sm text-neutral-400">{desc}</div>
    </div>
  </div>
);

const Placeholder = ({ label }: { label: string }) => (
  <div className="border-2 border-dashed border-neutral-800 rounded-2xl p-6 text-center text-neutral-500 text-sm">
    {label}
  </div>
);

export default function DemoApp() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [style, setStyle] = useState("Modern");
  const [renderUrl, setRenderUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const accept = "image/*,application/pdf";

  const useFile = (f: File) => {
    setFile(f);
    setFileName(f.name);
    setRenderUrl(null);
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) useFile(f);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);
    const f = e.dataTransfer.files?.[0];
    if (f) useFile(f);
  };

  const onDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(true);
  };

  const onDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);
  };

  const handleGenerateRender = async (regen = false) => {
    if (!file) return alert("Upload a floorplan first");
    try {
      setIsGenerating(true);
      const fd = new FormData();
      fd.append("blueprint", file);
      fd.append("style", style);
      if (regen) fd.append("seed", String(Math.floor(Math.random() * 1e9)));
      const out = await postForm("/api/render", fd);
      setRenderUrl(out.image_url);
    } catch (e: any) {
      alert(e.message || "Failed to generate render");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="max-w-6xl mx-auto px-5 py-8 flex items-center justify-between">
        <div className="text-xl font-bold tracking-tight text-neutral-100">
          PlanLift <span className="text-neutral-400">(MVP)</span>
        </div>
        <button className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-900 text-sm">
          Request Pilot
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-5 pb-20">
        <section className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-neutral-100">
              Upload a 2D blueprint → get a 3D render in minutes.
            </h1>
            <p className="text-neutral-400 mt-3">
              Prototype demo. Inputs: JPG/PNG/PDF. Output: 3D-style still (walkthrough later).
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Feature title="2D → 3D Render" desc="Photoreal hero images from your floorplan." />
              <Feature title="Walkthrough" desc="Coming soon (MP4 export)." />
              <Feature title="Style Switch" desc="Modern, Minimal, Rustic, Luxury presets." />
            </div>
          </div>

          <motion.div
            className="rounded-3xl bg-neutral-900 shadow-lg border border-neutral-800 p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-neutral-100">Demo Console</div>
              <div className="text-xs text-neutral-500">Connected to local API</div>
            </div>

            {/* Upload box */}
            <div className="mb-2 text-sm font-medium text-neutral-200">1) Upload floorplan</div>
            <label
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition
              ${isHovering ? "bg-neutral-800 border-neutral-600" : "bg-neutral-900 border-neutral-700"}`}
            >
              <span className="text-sm text-neutral-400 px-4 text-center">
                {fileName ? `Uploaded: ${fileName}` : "Click to upload or drag & drop a floorplan (PNG/JPG/PDF)"}
              </span>
              <input type="file" accept={accept} onChange={onUpload} className="hidden" />
            </label>

            {/* Style chips */}
            <div className="mt-4">
              <div className="mb-2 text-sm font-medium text-neutral-200">2) Choose style</div>
              <div className="flex gap-2 flex-wrap">
                {["Modern", "Minimal", "Rustic", "Luxury"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`px-3 py-1.5 rounded-full border ${
                      style === s
                        ? "bg-neutral-100 text-neutral-900 border-neutral-100"
                        : "bg-neutral-800 text-neutral-200 border-neutral-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => handleGenerateRender(false)}
                className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-900 text-sm flex items-center gap-2"
              >
                <Sparkles size={16} /> Generate Render
              </button>
              <button
                onClick={() => handleGenerateRender(true)}
                className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-neutral-200 flex items-center gap-2"
              >
                <RotateCw size={16} /> Regen
              </button>
            </div>

            {/* Preview */}
            <div className="mt-5 grid grid-cols-1 gap-4">
              {renderUrl ? (
                <img src={renderUrl} alt="Render preview" className="rounded-2xl border border-neutral-800" />
              ) : (
                <Placeholder label="Preview Render (appears here after generation)" />
              )}
            </div>

            {/* Loading */}
            {isGenerating && (
              <div className="mt-4 text-sm text-neutral-400 flex items-center gap-2">
                <ArrowRight size={16} /> Generating… please wait
              </div>
            )}
          </motion.div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <Step n={1} title="Upload 2D plan" desc="PNG/JPG/PDF export from CAD or scan." />
          <Step n={2} title="Pick a style" desc="Modern, Minimal, Rustic, Luxury." />
          <Step n={3} title="Get outputs" desc="Stills (MP4 later). Share with your client." />
        </section>

        <section className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-sm">
          <div className="font-semibold mb-3 text-neutral-100">Pilot Acceptance (today)</div>
          <ul className="grid md:grid-cols-2 gap-3 text-sm text-neutral-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5" /> 3 hero images per floor
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5" /> Style presets supported
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5" /> Walkthrough coming soon
            </li>
          </ul>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-5 py-10 text-xs text-neutral-500">
        Visualization only. Not BIM/engineering documentation.
      </footer>
    </div>
  );
}
