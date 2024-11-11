import BackgroundLightOne from '../lights/background-light-one'
import SeeMoreDistritosButton from './see-more-distritos'
import ArrowRight from '../icons/arrow-right'
import type { Distrito } from '@/types'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { DEFAULT_API_LIMIT_FOR } from '@/pages/api/_states'

export default function Distritos({
  initialDistritos,
  fetchFrom
}: {
  initialDistritos: Distrito[] | null
  fetchFrom?: string
}) {
  const [distritos, setDistritos] = useState(initialDistritos ?? [])

  const updateDistritos = (newDistritos: Distrito[]) => {
    // TODO: validate with zod
    setDistritos((prev) => [...prev, ...newDistritos])
  }

  return (
    <section className="relative flex flex-col gap-12 justify-center items-center w-full">
      <div className="absolute w-full h-fit md:bottom-[-5%] md:-right-12 rounded-full opacity-30">
        <BackgroundLightOne />
      </div>

      {distritos.length === 0 ? (
        <h2>Sin Distritos a mostrar</h2>
      ) : (
        <>
          <h2 className="text-3xl font-bold font-outift">Distritos</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            layout
          >
            {distritos?.map((distrito, index) => (
              <motion.div
                key={distrito.id}
                className="bg-white shadow-lg border rounded-lg max-w-[300px] overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: 'easeOut'
                }}
                layout
              >
                <a href={`/distrito/${distrito.id}`}>
                  <header className="relative w-[300px] h-[270px] overflow-hidden rounded-t-lg">
                    <img
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-t-lg"
                      src={distrito.main_image ?? ''}
                      alt={distrito.name}
                      width={300}
                      height={270}
                    />
                  </header>
                  <div className="p-4 flex flex-col gap-5">
                    <div className="flex flex-col gap-5">
                      <h5 className="font-bold">{distrito.name}</h5>
                      <p className="text-sm h-20">{distrito.description}</p>
                    </div>
                    <div className="w-full">
                      <div className="flex gap-2 items-center w-fit hover:text-primary transition-colors">
                        Visitar
                        <ArrowRight size={15} />
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
      <SeeMoreDistritosButton
        updateDistritos={updateDistritos}
        existsNextPage={distritos.length < DEFAULT_API_LIMIT_FOR.distritos}
        endpoint={fetchFrom}
      />
    </section>
  )
}
