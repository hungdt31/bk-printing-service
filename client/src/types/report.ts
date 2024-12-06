export interface GenerateReportResponse {
  data: {
    printOrder: {
      totalA4Pages: number,
      totalA3Pages: number,
      usersUsedService: {
        user_id: number,
        username: string,
        email: string,
        avatar: {
          url: string,
          path: string
        },
        totalConsumedPages: number
      }[],
    },
    purchaseOrder: {
      payments: [
        key: string,
        value: number
      ][],
      total: number,
    },
    printer: {
      printers: {
        name: string,
        status: string,
        _count: {
          printOrders: number,
          printingTime: number,
        }
      }[],
      totalUsingPrinters: number,
    }
  },
  message: string
}