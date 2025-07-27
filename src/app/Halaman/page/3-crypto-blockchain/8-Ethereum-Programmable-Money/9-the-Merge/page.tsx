"use client";
import Container from "../container/page";
import { Data } from "../container/data";

export default function CryptoSpotTrading() {
  const currentId = "9";
  const nextModuleData = Data.find(item => item.id === "10");
  
  return <Container searchParams={{ id: currentId, next: nextModuleData?.link }} />;
}
