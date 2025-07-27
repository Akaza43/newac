"use client";
import Container from "../container/page";
import { Data } from "../container/data";

export default function CryptoSpotTrading() {
  const currentId = "7";
  const nextModuleData = Data.find(item => item.id === "8");
  
  return <Container searchParams={{ id: currentId, next: nextModuleData?.link }} />;
}
