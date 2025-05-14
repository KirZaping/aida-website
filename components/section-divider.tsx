"use client"

import { motion } from "framer-motion"

export default function SectionDivider() {
  return (
    <motion.div
      className="my-4 h-16 w-1 rounded-full bg-gradient-to-b from-blue-500 to-blue-800 hidden sm:block"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.125 }}
    />
  )
}
