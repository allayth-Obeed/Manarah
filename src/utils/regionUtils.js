/**
 * أدوات مساعدة للتعامل مع شجرة التقسيم الجغرافي (محافظة → منطقة → منطقة فرعية → موقع)
 * القادمة من GET /api/regions/tree، مستخدمة بديالوجات إضافة/تعديل المسجد
 */

/**
 * يبحث عن اسم الموقع المختار داخل شجرة المناطق لاشتقاق "المدينة" تلقائياً بدل الكتابة اليدوية
 * @param {Array} tree - شجرة المحافظات القادمة من regionService.getRegionsTree()
 * @param {{regionId: number, subRegionId: number, locationId: number}} selection
 * @returns {string} اسم الموقع إن وُجد، أو نص فارغ
 */
export const findSelectedLocationName = (tree = [], { regionId, subRegionId, locationId } = {}) => {
  for (const province of tree) {
    const region = province.regions?.find((r) => r.id === regionId)
    if (!region) continue
    const subRegion = region.subRegions?.find((s) => s.id === subRegionId)
    if (!subRegion) continue
    const location = subRegion.locations?.find((l) => l.id === locationId)
    if (location) return location.name
  }
  return ''
}
