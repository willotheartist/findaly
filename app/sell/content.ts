// app/sell/content.ts

export type FaqItem = {
  q: string
  a: string
}

export const faqs: FaqItem[] = [
  {
    q: "How much does it cost to sell my boat on Findaly?",
    a: "Listing your boat is completely free. We don't charge commission on the sale. Pro accounts unlock premium placement and analytics for brokers and dealers.",
  },
  {
    q: "Can I list a boat for sale privately, without a broker?",
    a: "Absolutely. Findaly is built for both private sellers and professional brokers. Create a free account, add your listing, and buyers can message you directly.",
  },
  {
    q: "What types of vessels can I sell on Findaly?",
    a: "Everything that moves on water — yachts, sailboats, motorboats, catamarans, RIBs, jet skis, dinghies, fishing boats, houseboats, and more.",
  },
  {
    q: "How do I write a good listing?",
    a: "High-quality photos make the biggest difference. After that, accurate specs (length, engine hours, year) and an honest description of the vessel's condition drive serious enquiries.",
  },
  {
    q: "Can I also list my boat for charter while it's for sale?",
    a: "Yes. Findaly supports dual listings — you can mark a vessel as available for both sale and charter simultaneously.",
  },
]