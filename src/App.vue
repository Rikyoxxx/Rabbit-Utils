<template>
  <n-card title="Excel合并" class="h-full shadow-sm rounded-16px">
    <template #header-extra>
      <n-space align="center">
        <n-button :disabled="uploadDataset.length !== 0" size="small" type="error">
          表头设置
        </n-button>
        <n-button :disabled="uploadDataset.length === 0" size="small" @click="handleDatasetClear">
          清空表格
        </n-button>
        <n-upload action="#" :default-upload="false" :show-file-list="false"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          @before-upload="handleDatasetSelect" multiple>
          <n-button size="small" :loading="loading">
            解析Excel表
          </n-button>
        </n-upload>
        <n-button :disabled="uploadDataset.length === 0" size="small" type="primary" @click="handleDatasetExport">
          导出Excel表
        </n-button>
      </n-space>
    </template>
    <loading-empty-wrapper class="h-full" :loading="loading" :empty="empty">
      <n-data-table key="verse_table_upload_mode" class="h-full" :columns="tableColumns" :data="uploadDataset"
        :pagination="pagination" :flex-height="true" :striped="true" :scroll-x="tableWidth" />
    </loading-empty-wrapper>
  </n-card>
</template>

<script setup lang="ts">
// import { message } from '@tauri-apps/api/dialog';
import { read as ReadExcel, writeFileXLSX, utils as ExcelUtils } from 'xlsx'
import { useLoadingEmpty } from '@/hooks'
import type {
  DataTableColumns,
  UploadFileInfo,
} from 'naive-ui'

const { loading, startLoading, endLoading, empty, setEmpty } = useLoadingEmpty()

const tableColumns: DataTableColumns<Record<string, string>> = [
  {
    title: '订单号',
    key: 'orderNo',
    align: 'center',
    width: 120
  },
  {
    title: '买家昵称',
    key: 'buyerName',
    align: 'center',
    width: 100
  },
  {
    title: '平台订单状态',
    key: 'orderState',
    align: 'center',
    width: 90
  },
  {
    title: '下单时间',
    key: 'orderTime',
    align: 'center',
    width: 120
  },
  {
    title: '付款时间',
    key: 'payTime',
    align: 'center',
    width: 120
  },
  {
    title: '发货时间',
    key: 'deliveryTime',
    align: 'center',
    width: 120
  },
  {
    title: '交易结束时间',
    key: 'orderEndTime',
    align: 'center',
    width: 120
  },
  {
    title: '客户实付金额',
    key: 'paidAmount',
    align: 'center',
    width: 100
  },
  {
    title: '邮费',
    key: 'deliveryFee',
    align: 'center',
    width: 100
  },
  {
    title: 'discount_fee',
    key: 'totalDiscount',
    align: 'center',
    width: 100
  },
  {
    title: '红包',
    key: 'redPacket',
    align: 'center',
    width: 100
  },
  {
    title: '快递公司',
    key: 'deliveryInc',
    align: 'center',
    width: 100
  },
  {
    title: '运单号',
    key: 'deliveryNo',
    align: 'center',
    width: 120
  },
  {
    title: '商家备注',
    key: 'comment',
    align: 'center',
    width: 150
  },
  {
    title: '子订单号',
    key: 'subOrderNo',
    align: 'center',
    width: 120
  },
  {
    title: '商品标题',
    key: 'productTitle',
    align: 'center',
    width: 120
  },
  {
    title: '商品属性',
    key: 'productAttribute',
    align: 'center',
    width: 120
  },
  {
    title: 'SKU',
    key: 'productSku',
    align: 'center',
    width: 120
  },
  {
    title: '购买数量',
    key: 'quantity',
    align: 'center',
    width: 100
  },
  {
    title: '商品原价',
    key: 'productOriginalPrice',
    align: 'center',
    width: 100
  },
  {
    title: '商品折后单价',
    key: 'price',
    align: 'center',
    width: 100
  },
  {
    title: '商品折后总价',
    key: 'totalPrice',
    align: 'center',
    width: 100
  },
  {
    title: '手工调整',
    key: 'adjustmentAmount',
    align: 'center',
    width: 100
  },
  {
    title: '商品打折金额',
    key: 'totalDiscountAmount',
    align: 'center',
    width: 100
  },
  {
    title: '单件商品打折金额',
    key: 'discountAmount',
    align: 'center',
    width: 100
  },
  {
    title: '商品实付金额',
    key: 'totalProductPaidAmount',
    align: 'center',
    width: 100
  },
  {
    title: '客户实付单价',
    key: 'productPaidAmount',
    align: 'center',
    width: 100
  },
  {
    title: '分摊后的整个SKU优惠金额',
    key: 'totalOfferAmount',
    align: 'center',
    width: 100
  },
  {
    title: '单个SKU优惠金额',
    key: 'offerAmount',
    align: 'center',
    width: 100
  },
  {
    title: '关税',
    key: 'tariff',
    align: 'center',
    width: 100
  },
  {
    title: '退款单号',
    key: 'refundOrderNo',
    align: 'center',
    width: 120
  }
]
const tableWidth = computed(() => tableColumns.reduce((acc, cur) => acc + Math.max(Number(cur.width) || 0, Number(cur.minWidth) || 0), 0))


const uploadDataset = ref<Record<string, string>[]>([])
const pagination = reactive({
  page: 1,
  pageSize: 20,
  pageCount: 1,
  onChange: (page: number) => {
    pagination.page = page
  }
})

const transferCache = new Map<string, {
  key?: [string[], Map<string, string>],
  title?: [string[], Map<string, string>]
}>()
/**
 * 把表格列配置转换为映射表
 * @param type true title2key, false key2title
 */
const transferColumns2Map = (type = false) => {
  const _json = JSON.stringify(tableColumns)
  let _cache = transferCache.get(_json)

  if (_cache) {
    if (type && _cache.title) return _cache.title
    if (!type && _cache.key) return _cache.key
  }

  const _arr: string[] = []
  const _attr: [string, string][] = tableColumns.map((column) => {
    const { title, key } = column as { title: string, key: string }

    if (type) {
      _arr.push(title)
      return [title, key]
    } else {
      _arr.push(key)
      return [key, title]
    }
  })

  const _map = new Map<string, string>(_attr)
  _cache = _cache || {}
  Object.assign(_cache, type ? { title: [_arr, _map] } : { key: [_arr, _map] })
  transferCache.set(_json, _cache)

  return [_arr, _map] as [string[], Map<string, string>]
}

/** 解析Excel文件 */
const readXlsxFileToJson = async (file: File) => {
  let xlsxData: Record<string, string>[] = []
  try {
    const fileBuffer = await file.arrayBuffer()
    const workbook = ReadExcel(fileBuffer, { type: 'buffer', cellDates: true, cellText: false })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    xlsxData = ExcelUtils.sheet_to_json(sheet, { dateNF: 'yyyy/MM/dd hh:mm:ss', raw: false })
  } catch (_) {
    // message('表格格式有误！', { title: '错误', type: 'error' })
    alert('表格格式有误！')
  }

  return xlsxData
}
/** 上传Excel文件 */
const handleDatasetSelect = async ({ file }: { file: UploadFileInfo }) => {
  const _file = file.file
  if (!_file) return false
  if (file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    // message('请选择正确的XLSX文件！', { title: '错误', type: 'error' })
    alert('请选择正确的XLSX文件！')
    return false
  }

  // 延时开启loading状态
  const timer = setTimeout(startLoading, 300)
  try {
    const [keys, keysMap] = transferColumns2Map()
    const datasetFromXlsx = await readXlsxFileToJson(_file)
    datasetFromXlsx.forEach((data) => {
      const _data = Object.assign({}, ...keys.map(key => ({ [key]: data[keysMap.get(key)!] || '' })))
      uploadDataset.value.unshift(_data)
    })

    setEmpty(!uploadDataset.value.length)
    pagination.page = 1
  } catch (_) {
    // message('表格格式有误！', { title: '错误', type: 'error' })
    alert('表格格式有误！')
  } finally {
    clearTimeout(timer)
    loading && endLoading()
  }

  return true
}

const handleDatasetClear = () => {
  uploadDataset.value = []
}

const handleDatasetExport = async () => {
  const [titles, titlesMap] = transferColumns2Map(true)
  const data = uploadDataset.value.map(data => Object.assign({}, ...titles.map(title => ({ [title]: data[titlesMap.get(title)!] || '' }))))


  const workbook = ExcelUtils.book_new();
  const worksheet = ExcelUtils.json_to_sheet(data);
  ExcelUtils.book_append_sheet(workbook, worksheet, 'Sheet1');

  try {
    await writeFileXLSX(workbook, '合并结果.xlsx');
    // message('导出成功', { title: '成功' })
    alert('导出成功')
  } catch (error) {
    // message(error as string, { title: '错误', type: 'error' })
    alert(error)
  }

}

</script>

<style scoped>
</style>
