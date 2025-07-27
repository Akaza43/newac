"use client";
import Container from "../container/page";
import { Data } from "../container/data";

export default function CryptoSpotTrading() {
  const currentId = "39";
  const nextModuleData = Data.find(item => item.id === "40");
  
  return <Container searchParams={{ id: currentId, next: nextModuleData?.link }} />;
}
