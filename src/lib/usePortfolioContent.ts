import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export type Project = {
  id: string;
  title: string;
  date: string;
  description: string;
  tags: string;
  sort_order: number;
};

export type ProjectImage = {
  id: string;
  project_id: string;
  image_url: string;
  sort_order: number;
};

export type ProjectPdf = {
  id: string;
  project_id: string;
  pdf_url: string;
  label: string;
  sort_order: number;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  bullets: string[];
  sort_order: number;
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  sort_order: number;
};

export type Publication = {
  id: string;
  title: string;
  journal: string;
  year: string;
  description: string;
  sort_order: number;
};

export type IntroSection = {
  id: string;
  section_key: string;
  heading: string;
  body: string[];
  sort_order: number;
};

export type PortfolioContent = {
  projects: Project[];
  projectImages: Record<string, ProjectImage[]>;
  projectPdfs: Record<string, ProjectPdf[]>;
  experiences: Experience[];
  certifications: Certification[];
  publications: Publication[];
  introSections: IntroSection[];
  loading: boolean;
};

const empty: PortfolioContent = {
  projects: [],
  projectImages: {},
  projectPdfs: {},
  experiences: [],
  certifications: [],
  publications: [],
  introSections: [],
  loading: true,
};

export function usePortfolioContent(): PortfolioContent {
  const [content, setContent] = useState<PortfolioContent>(empty);

  useEffect(() => {
    let active = true;

    async function load() {
      const [projRes, imgRes, pdfRes, expRes, certRes, pubRes, introRes] = await Promise.all([
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
        supabase.from('project_images').select('*').order('sort_order', { ascending: true }),
        supabase.from('project_pdfs').select('*').order('sort_order', { ascending: true }),
        supabase.from('experiences').select('*').order('sort_order', { ascending: true }),
        supabase.from('certifications').select('*').order('sort_order', { ascending: true }),
        supabase.from('publications').select('*').order('sort_order', { ascending: true }),
        supabase.from('introduction_content').select('*').order('sort_order', { ascending: true }),
      ]);

      if (!active) return;

      const projects = (projRes.data ?? []) as Project[];
      const images = (imgRes.data ?? []) as ProjectImage[];
      const pdfs = (pdfRes.data ?? []) as ProjectPdf[];

      const imageMap: Record<string, ProjectImage[]> = {};
      for (const img of images) {
        if (!imageMap[img.project_id]) imageMap[img.project_id] = [];
        imageMap[img.project_id].push(img);
      }

      const pdfMap: Record<string, ProjectPdf[]> = {};
      for (const pdf of pdfs) {
        if (!pdfMap[pdf.project_id]) pdfMap[pdf.project_id] = [];
        pdfMap[pdf.project_id].push(pdf);
      }

      setContent({
        projects,
        projectImages: imageMap,
        projectPdfs: pdfMap,
        experiences: (expRes.data ?? []) as Experience[],
        certifications: (certRes.data ?? []) as Certification[],
        publications: (pubRes.data ?? []) as Publication[],
        introSections: (introRes.data ?? []) as IntroSection[],
        loading: false,
      });
    }

    load();
    return () => { active = false; };
  }, []);

  return content;
}
