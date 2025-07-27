"use client";
import Container from "../container/page";
import { Data } from "../container/data";

export default function CryptoSpotTrading() {
  const currentId = "19";
  const nextModuleData = Data.find(item => item.id === "20");
  
  return <Container searchParams={{ id: currentId, next: nextModuleData?.link }} />;
}
