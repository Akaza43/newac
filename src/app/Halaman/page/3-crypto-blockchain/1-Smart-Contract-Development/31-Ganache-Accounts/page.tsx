"use client";
import Container from "../container/page";
import { Data } from "../container/data";

export default function CryptoSpotTrading() {
  const currentId = "31";
  const nextModuleData = Data.find(item => item.id === "32");
  
  return <Container searchParams={{ id: currentId, next: nextModuleData?.link }} />;
}
