import type { Metadata } from "next";
import SurveyInspectionClient from "./SurveyInspectionClient";

export const metadata: Metadata = {
  title: "Yacht Survey & Inspection Guide: What’s Checked + Sea Trial Tips | Findaly",
  description:
    "Understand yacht surveys and inspections: what surveyors check, sea trial checklists, common findings, and how to negotiate using the report.",
  alternates: { canonical: "/guides/survey-inspection" },
};

export default function Page() {
  return <SurveyInspectionClient />;
}
