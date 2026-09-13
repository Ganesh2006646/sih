const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const dams = [
  { id: 'tehri', name: 'Tehri', river: 'Bhagirathi', state: 'Uttarakhand', type: 'Earth-rockfill', height: 260, capacity: 3.54, region: 'Himalayan', mapX: 29, mapY: 18, downstream: [['Rishikesh', 'T+0:42', 'Extreme'], ['Haridwar', 'T+1:16', 'Extreme'], ['Bijnor', 'T+2:34', 'High'], ['Najibabad', 'T+3:12', 'Moderate']] },
  { id: 'bhakra', name: 'Bhakra', river: 'Sutlej', state: 'Himachal Pradesh', type: 'Concrete gravity', height: 226, capacity: 9.34, region: 'Himalayan', mapX: 24, mapY: 24, downstream: [['Nangal', 'T+0:38', 'Extreme'], ['Rupnagar', 'T+1:24', 'High'], ['Ludhiana', 'T+3:08', 'High'], ['Patiala', 'T+4:20', 'Moderate']] },
  { id: 'rishiganga', name: 'Rishiganga', river: 'Rishiganga', state: 'Uttarakhand', type: 'Landslide/natural dam', height: 60, capacity: 0.02, region: 'Himalayan', mapX: 34, mapY: 22, downstream: [['Raini', 'T+0:18', 'Extreme'], ['Joshimath', 'T+0:47', 'Extreme'], ['Chamoli', 'T+1:32', 'High'], ['Karanprayag', 'T+2:40', 'Moderate']] },
  { id: 'hirakud', name: 'Hirakud', river: 'Mahanadi', state: 'Odisha', type: 'Composite earth+concrete', height: 61, capacity: 5.90, region: 'Peninsular', mapX: 63, mapY: 56, downstream: [['Sambalpur', 'T+0:24', 'Extreme'], ['Bargarh', 'T+1:08', 'High'], ['Sonepur', 'T+2:16', 'High'], ['Cuttack', 'T+5:10', 'Moderate']] },
  { id: 'nagarjuna', name: 'Nagarjuna Sagar', river: 'Krishna', state: 'Telangana / AP', type: 'Masonry gravity', height: 124, capacity: 6.84, region: 'Peninsular', mapX: 52, mapY: 67, downstream: [['Nandigama', 'T+0:54', 'Extreme'], ['Vijayawada', 'T+2:12', 'High'], ['Guntur', 'T+3:04', 'High'], ['Machilipatnam', 'T+5:28', 'Moderate']] },
  { id: 'idukki', name: 'Idukki', river: 'Periyar', state: 'Kerala', type: 'Concrete arch', height: 169, capacity: 1.99, region: 'Peninsular', mapX: 38, mapY: 84, downstream: [['Cheruthoni', 'T+0:22', 'Extreme'], ['Kothamangalam', 'T+1:18', 'High'], ['Perumbavoor', 'T+2:16', 'High'], ['Aluva', 'T+3:40', 'Moderate']] },
]

export async function fetchDams() { await pause(420); return dams }
export async function estimateBreachParams(dam, failureMode) { await pause(460); return { width: Math.round(Math.min(500, Math.max(40, dam.height * (failureMode === 'Instantaneous' ? 0.8 : 0.65)))), depth: Math.round(dam.height * 0.36), time: failureMode === 'Instantaneous' ? 12 : 45, slope: failureMode === 'Natural dam breach' ? 1.4 : 1, level: 92 } }
export async function runSimulation(_dam, _scenario, onProgress) { for (let progress = 0; progress <= 100; progress += 4) { await pause(560); onProgress?.(progress) } return { runId: 'RUN-2026-0428-014', status: 'complete' } }
export async function fetchValidationMetrics(_runId) { await pause(350); return { iou: 0.68, csi: 0.74, f1: 0.79, pod: 0.83, far: 0.27 } }
export async function fetchImpactAssessment(_runId) { await pause(350); return { population: [18200, 24700], buildings: [4180, 5920] } }
