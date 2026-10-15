import { useState, useEffect } from 'react'
import { servicesApi, type ServiceCategory, type GroupedServices } from '@/api/services'
import type { Service } from '@/types'

export type { GroupedServices }

export function useServices(category?: string) {
  const [services,  setServices]  = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    servicesApi.getAll({ category: category || undefined })
      .then(r => setServices(r.data.data as Service[]))
      .catch(() => setServices([]))
      .finally(() => setIsLoading(false))
  }, [category])

  return { services, isLoading }
}

export function useGroupedServices() {
  const [groups,    setGroups]    = useState<GroupedServices[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    servicesApi.getAll({ grouped: true })
      .then(r => setGroups(r.data.data as GroupedServices[]))
      .catch(() => setGroups([]))
      .finally(() => setIsLoading(false))
  }, [])

  return { groups, isLoading }
}

export function useServiceCategories() {
  const [categories, setCategories] = useState<ServiceCategory[]>([])

  useEffect(() => {
    servicesApi.getCategories()
      .then(r => setCategories(r.data.data))
      .catch(() => {})
  }, [])

  return { categories }
}
