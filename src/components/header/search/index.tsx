// import SearchIcon from '@/components/icons/search'
// import blurBackgroundOnScroll from '@/utils/blur-on-scroll'
// import { useEffect, useRef, useState } from 'react'
// import {
//   CommandDialog,
//   CommandEmpty,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandSeparator
// } from '@/components/dialog-from-command'
// import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
// import { DialogDescription, DialogTitle } from '@/components/dialog'
// import { useDebouncedCallback } from 'use-debounce'
// // import { CommandLoading } from 'cmdk'
// import { slugify } from '@/utils/formatter'
// import type { SearchResult } from '@/pages/api/search'
// import getIconForPlaceType from '@/utils/get-icon-for-place-type'
// import { getInterestPointCategoryInEnglish } from '@/utils/mappers'

// interface SearchFormProps {
//   isFormOpen: boolean
//   handleFormOpen: (state: boolean) => void
// }

// export interface APIResponse {
//   data: SearchAPIResponseData
// }

// export interface SearchAPIResponseData {
//   statusText: 'success' | 'error'
//   data: SearchResult[] | string
// }

// function SearchForm({ isFormOpen, handleFormOpen }: SearchFormProps) {
//   const [query, setQuery] = useState('')
//   const [results, setResults] = useState<SearchResult[]>([])
//   const [isLoading, setIsLoading] = useState(false)

//   const debouncedSearch = useDebouncedCallback((inputValue) => {
//     setQuery(inputValue)
//   }, 1000)

//   const search = async (searchQuery: string) => {
//     if (!searchQuery) {
//       return setResults([])
//     }

//     try {
//       setIsLoading(true)
//       const response = await fetch('/api/search', {
//         body: JSON.stringify({ query: searchQuery }),
//         method: 'POST',
//         headers: {
//           'Content-type': 'application/json'
//         }
//       })

//       const json = (await response.json()) as APIResponse

//       setIsLoading(false)

//       const { data: results } = json.data

//       if (typeof results === 'string') {
//         return // TODO: add toast for errors
//       }

//       setResults(results)
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   useEffect(() => {
//     search(query)
//   }, [query])

//   return (
//     <>
//       <CommandDialog open={isFormOpen} onOpenChange={handleFormOpen}>
//         <VisuallyHidden.Root>
//           <DialogTitle>Buscar distrito o lugar</DialogTitle>
//           <DialogDescription>
//             Puedes usar queries para buscar lugares
//           </DialogDescription>
//         </VisuallyHidden.Root>
//         <CommandInput
//           placeholder="Buscá algún distrito o lugar..."
//           onValueChange={(query) => debouncedSearch(query)}
//         />
//         <CommandList>
//           {isLoading && (
//             // <CommandLoading className="text-center text-sm py-6">
//             //   Cargando...
//             // </CommandLoading>
//             <span>Cargando...</span>
//           )}

//           {!isLoading && results.length === 0 ? (
//             <CommandEmpty>Sin resultados.</CommandEmpty>
//           ) : null}

//           {results.map((result) => {
//             const Icon = getIconForPlaceType({
//               type: getInterestPointCategoryInEnglish(
//                 result.interestPointType ?? 'otro'
//               )
//             })

//             const href =
//               result.type === 'punto_de_interes'
//                 ? `/puntos/${result.id}/${slugify(result.distrito_name ?? '')}/${slugify(result.name)}?distrito_id=${result.distrito_id}`
//                 : `/distrito/${result.id}`

//             return (
//               <CommandItem key={result.name} value={result.name}>
//                 <Icon />
//                 <a href={href} className="w-full">
//                   {result.name}
//                 </a>
//               </CommandItem>
//             )
//           })}
//           <CommandSeparator />
//         </CommandList>
//       </CommandDialog>
//     </>
//   )
// }

// export default function Search() {
//   const searchButtonRef = useRef<HTMLButtonElement>(null)
//   const [isFormOpen, setIsFormOpen] = useState(false)

//   useEffect(() => {
//     const { current: searchButton } = searchButtonRef
//     blurBackgroundOnScroll({ element: searchButton })
//   }, [])

//   useEffect(() => {
//     const down = (e: KeyboardEvent) => {
//       if (e.key === 'b' && e.ctrlKey) {
//         e.preventDefault()
//         setIsFormOpen(true)
//       }
//     }

//     document.addEventListener('keydown', down)
//     return () => document.removeEventListener('keydown', down)
//   }, [])

//   const handleFormOpen = (state: boolean) => {
//     if (typeof state !== 'boolean') {
//       throw new Error('State must be of type boolean')
//     }

//     setIsFormOpen(state)
//   }

//   return (
//     <>
//       <div>
//         <button
//           type="button"
//           id="search-nav"
//           ref={searchButtonRef}
//           onClick={() => handleFormOpen(!isFormOpen)}
//           className="p-2 border-2 text-primary border-primary rounded-full transition-colors"
//         >
//           <SearchIcon size={20} />
//         </button>
//       </div>

//       <SearchForm isFormOpen={isFormOpen} handleFormOpen={handleFormOpen} />
//     </>
//   )
// }
