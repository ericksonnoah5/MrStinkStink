"use client";

import { supabase } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AlarmClock, Dog, Droplets, OctagonX, PaperBag } from "lucide-react";

const CENTRAL_TIME_ZONE = "America/Chicago";

export default function DashboardV2Page() {
  const [currenttime, setcurrenttime] = useState<Date>();
  const [poopnumber, setpoopnumber] = useState(0);
  const [peenumber, setpeenumber] = useState(0);
  const [lastpoop, setlastpoop] = useState<Date>();
  const [lastpee, setlastpee] = useState<Date>();
  const [accidents, setaccidents] = useState(0);
  const [nextpoop, setnextpoop] = useState(0);
  const [nextpee, setnextpee] = useState(0);

  const currenttimeRef = useRef<Date | undefined>(undefined);
  const lastpoopRef = useRef<Date | undefined>(undefined);
  const lastpeeRef = useRef<Date | undefined>(undefined);

  function updateCurrentTime(time: Date) {
    currenttimeRef.current = time;
    setcurrenttime(time);
  }
  function updateLastPoop(time: Date) {
    lastpoopRef.current = time;
    setlastpoop(time);
  }
  function updateLastPee(time: Date) {
    lastpeeRef.current = time;
    setlastpee(time);
  }

  const getPoopTime = useCallback(async () => {
    const { data: pooptime } = await supabase
      .from("PottyTime")
      .select("time")
      .eq('"poop times"', 1)
      .order("time", { ascending: false })
      .limit(1)
      .single();

    if (pooptime) {
      updateLastPoop(new Date(pooptime.time));
    }
  }, []);

  const getPeetime = useCallback(async () => {
    const { data: peetime } = await supabase
      .from("PottyTime")
      .select("time")
      .eq('"pee times"', 1)
      .order("time", { ascending: false })
      .limit(1)
      .single();

    if (peetime) {
      updateLastPee(new Date(peetime.time));
    }
  }, []);

  const getAccidents = useCallback(async () => {
    const { data: hasaccidents } = await supabase
      .from("PottyTime")
      .select("accident")
      .eq("accident", 1);

    if (hasaccidents) {
      setaccidents(hasaccidents.length);
    }
  }, []);

  const getPoop = useCallback(async () => {
    const { data: thetimes } = await supabase
      .from("PottyTime")
      .select('"poop times"')
      .eq('"poop times"', 1);

    if (thetimes) {
      setpoopnumber(thetimes.length);
    }
  }, []);

  const getPee = useCallback(async () => {
    const { data: thetimes } = await supabase
      .from("PottyTime")
      .select('"pee times"')
      .eq('"pee times"', 1);

    if (thetimes) {
      setpeenumber(thetimes.length);
    }
  }, []);

  const start = useCallback(async () => {
    updateCurrentTime(new Date());
    await getPoopTime();
    await getPeetime();
    await getAccidents();
    await getPoop();
    await getPee();
    lastpoopt();
    lastpeep();
  }, [getPoopTime, getPeetime, getAccidents, getPoop, getPee]);

  useEffect(() => {
    start();

    const gettime = setInterval(() => {
      updateCurrentTime(new Date());
      lastpoopt();
      lastpeep();
    }, 1000);

    return () => clearInterval(gettime);
  }, [start]);

  function lastpoopt() {
    if (lastpoopRef.current != null && currenttimeRef.current != null) {
      const npoop =
        currenttimeRef.current.getTime() - lastpoopRef.current.getTime();
      setnextpoop(npoop);
    }
  }
  function lastpeep() {
    if (lastpeeRef.current != null && currenttimeRef.current != null) {
      const npee =
        currenttimeRef.current.getTime() - lastpeeRef.current.getTime();
      setnextpee(npee);
    }
  }

  function formatElapsed(ms: number) {
    if (ms < 0) return null;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }

  function formatClock(time: Date) {
    return time.toLocaleTimeString("en-US", {
      timeZone: CENTRAL_TIME_ZONE,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  async function setpoopdata() {
    if (currenttime != null) {
      await supabase.from("PottyTime").insert({
        time: currenttime.toISOString(),
        "poop times": 1,
      });
    }
    await getPoop();
    await getPoopTime();
  }

  async function setpeedata() {
    if (currenttime != null) {
      await supabase.from("PottyTime").insert({
        time: currenttime.toISOString(),
        "pee times": 1,
      });
    }
    await getPee();
    await getPeetime();
  }

  async function setaccidentdata() {
    if (currenttime != null) {
      await supabase.from("PottyTime").insert({
        time: currenttime.toISOString(),
        accident: 1,
      });
    }
    await getAccidents();
  }

  return (
    <div className="font-bold text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/atlas.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 m-1 h-full rounded-3xl bg-black/60 p-4 font-sans tracking-wide backdrop-blur-md">
        <div className="mx-auto my-auto rounded-3xl border-4 border-gray-800 bg-gray-950 md:w-1/2">
          <h1 className="flex h-full items-center justify-center text-wrap p-14 text-center text-3xl md:text-5xl">
            <Dog className="!h-10 !w-10 md:!h-14 md:!w-14" /> Doggy potty dash
          </h1>
        </div>
        <div className="grid h-full w-full grid-cols-1 sm:grid-cols-4 md:gap-3">
          <h1 className="m-2 hidden h-full items-center justify-center p-5 text-3xl sm:block sm:text-center">
            Poos {poopnumber}
          </h1>
          <Button
            className="m-2 flex h-full items-center justify-center p-5 text-3xl"
            onClick={setpoopdata}
          >
            <PaperBag className="!h-10 !w-10" /> Poop
          </Button>
          <h1 className="m-2 flex h-full items-center justify-center p-5 text-3xl">
            {lastpoop ? formatClock(lastpoop) : null}
          </h1>
          <h1 className="m-2 flex h-full items-center justify-center gap-3 p-5 text-center text-3xl">
            <AlarmClock className="h-10 w-10" />
            {formatElapsed(nextpoop)}
          </h1>
          <div className="block text-center sm:hidden">
            ________________________________________
          </div>

          <h1 className="m-2 hidden h-full items-center justify-center p-5 text-3xl sm:block sm:text-center">
            Pees: {peenumber}
          </h1>
          <Button
            className="m-2 flex h-full items-center justify-center p-5 text-3xl"
            onClick={setpeedata}
          >
            <Droplets className="!h-10 !w-10" /> Pee
          </Button>
          <h1 className="m-2 flex h-full items-center justify-center p-5 text-3xl">
            {lastpee ? formatClock(lastpee) : null}
          </h1>
          <h1 className="m-2 flex h-full items-center justify-center gap-3 p-5 text-center text-3xl">
            <AlarmClock className="h-10 w-10" />
            {formatElapsed(nextpee)}
          </h1>
          <div className="block text-center sm:hidden">
            _______________________________________
          </div>

          <h1 className="m-2 hidden h-full items-center justify-center p-5 text-3xl sm:block sm:text-center">
            Accidents: {accidents}
          </h1>
          <Button
            className="m-2 flex h-full items-center justify-center p-5 text-3xl md:h-1/2"
            onClick={setaccidentdata}
          >
            <OctagonX className="!h-10 !w-10" />
            Accident
          </Button>
          <h1 className="m-2 hidden h-full items-center justify-center p-5 text-3xl sm:block sm:text-center">
            {currenttime ? formatClock(currenttime) : null}
          </h1>
          <h1 className="m-2 flex h-full items-center justify-center p-5 text-3xl">
            <Image src="/atlas.jpg" alt="Atlas" width={200} height={100} />
          </h1>
        </div>
      </div>
    </div>
  );
}
