interface PaginationParams {
  page: number
  size?: number
}

interface PaginationResult {
  from: number
  to: number
}

export const getPagination = ({
  page,
  size
}: PaginationParams): PaginationResult => {
  page = page === 0 ? 1 : page

  if (typeof page !== 'number' || !Number.isFinite(page) || page < 1) {
    throw new Error('page must be a positive number')
  }

  const limit = size ?? 3
  if (!Number.isFinite(limit) || limit < 1) {
    throw new Error('size must be a positive number')
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  return { from, to }
}
