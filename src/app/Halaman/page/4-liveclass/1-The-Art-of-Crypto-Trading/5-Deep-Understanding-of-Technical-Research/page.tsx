"use client";
import Container from "../container/page";
import { Data } from "../container/data";

export default function CryptoSpotTrading() {
  const currentId = "5";
  const nextModuleData = Data.find(item => item.id === "6");
  
  return <Container searchParams={{ id: currentId, next: nextModuleData?.link }} />;
}
