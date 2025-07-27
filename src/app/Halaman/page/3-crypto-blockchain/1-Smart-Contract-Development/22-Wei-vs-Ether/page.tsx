"use client";
import Container from "../container/page";
import { Data } from "../container/data";

export default function CryptoSpotTrading() {
  const currentId = "22";
  const nextModuleData = Data.find(item => item.id === "23");
  
  return <Container searchParams={{ id: currentId, next: nextModuleData?.link }} />;
}
