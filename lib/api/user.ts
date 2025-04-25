
export const getNonce = async (address: string) => {
  const res = await fetch("/api/user/nonce", {
    method: "POST",
    body: JSON.stringify({ address }),
  });
  return res.json();
};

export const getToken = async (address: string, signature: string, nonce: string) => {
  const res = await fetch("/api/user/token", {
    method: "POST",
    body: JSON.stringify({ address, signature, nonce }),
  });
  return res.json();
};
