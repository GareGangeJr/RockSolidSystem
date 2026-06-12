import { findNearestBranch } from "@/lib/branch-locations"



export type BranchCheckResult = {

  onSite: boolean

  branchName: string | null

  distanceMeters: number | null

}



/** Returns true only if the employee is within a branch geofence. */

export function checkBranchLocation(latitude: number, longitude: number): BranchCheckResult {

  const nearest = findNearestBranch(latitude, longitude)



  return {

    onSite: nearest.distanceMeters <= nearest.radiusMeters,

    branchName: nearest.name,

    distanceMeters: nearest.distanceMeters,

  }

}

