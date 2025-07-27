"use client";
import Container from "../container/page";
import { Data } from "../container/data";

export default function CryptoSpotTrading() {
  const currentId = "44";
  const nextModuleData = Data.find(item => item.id === "45");
  
  return <Container searchParams={{ id: currentId, next: nextModuleData?.link }} />;
}
