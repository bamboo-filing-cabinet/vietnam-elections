import CandidatesListClient from "./CandidatesListClient";

const SUPPORTED_CYCLES = ["na15-2021"];

export async function generateStaticParams() {
  return SUPPORTED_CYCLES.map((cycle) => ({ cycle }));
}

export default function CandidatesListPage({
  params,
}: {
  params: { cycle: string };
}) {
  return <CandidatesListClient cycle={params.cycle} />;
}
