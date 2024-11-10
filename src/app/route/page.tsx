import { EcoRoute } from "@/components/eco-route";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Route | Para Po!",
};

const RoutePage = () => {
  return (
    <EcoRoute />
  );
};

export default RoutePage;
