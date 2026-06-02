import { toast } from "sonner";
import { useEffect, useState } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

const getOrCreateViewer = () => {
  let identity = sessionStorage.getItem("cpstream-viewer-identity");
  let name = sessionStorage.getItem("cpstream-viewer-name");

  if (!identity) {
    identity = `guest_${crypto.randomUUID()}`;
    sessionStorage.setItem("cpstream-viewer-identity", identity);
  }

  if (!name) {
    const shortId = identity.slice(-4);
    name = `Guest_${shortId}`;
    sessionStorage.setItem("cpstream-viewer-name", name);
  }

  return { identity, name };
};

export const useViewerToken = (hostIdentity: string) => {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");

  useEffect(() => {
    const createToken = async () => {
      try {
        const viewer = getOrCreateViewer();

        const res = await fetch(`${BACKEND_URL}/api/livekit/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomName: hostIdentity,
            identity: viewer.identity,
            name: viewer.name,
            canPublish: false,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to create token");
        }

        const data = await res.json();

        setToken(data.token);

        const decodedToken = jwtDecode(data.token) as JwtPayload & {
          name?: string;
        };

        const decodedName = decodedToken?.name;
        const decodedIdentity = decodedToken.jti || viewer.identity;

        setIdentity(decodedIdentity);
        setName(decodedName || viewer.name);
      } catch (error) {
        console.log("TOKEN ERROR:", error);
        toast.error("Something went wrong! Error creating token");
      }
    };

    createToken();
  }, [hostIdentity]);

  return {
    token,
    name,
    identity,
  };
};