import {Customer} from '@/types'
import {commonDataPost} from "@/requests/common";


export async function addCustomer(url: string, { arg }: { arg: Customer}) {
    return commonDataPost<Customer>(url, arg)
}

export async function updateCustomer(url: string, {arg}: {arg: Customer}) {
    return commonDataPost<Customer>(url, arg)
}
