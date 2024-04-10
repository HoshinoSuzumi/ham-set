'use server'

export async function getTle() {
  return new Promise<{}>((resolve, reject) => {
    fetch('https://db.satnogs.org/api/tle/?format=json')
    .then(res => res.json())
    .then(res => {
      console.log(res)
      resolve(res)
    })
    .catch(err => reject(err))
  })
}