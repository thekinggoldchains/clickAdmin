import React, { FC } from 'react'

export const TakeawayIcon: FC<{
  size: number
  fill: string
  className: string
}> = ({ size, ...props }) => (
  <svg
    {...props}
    height={size}
    viewBox="0 0 512 512"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path d="m256 0c-75.045.003-104.111 54.669-105 55.458v65.542h-60v15c0 58.524-7.146 94.495-14.712 132.577-7.516 37.83-15.288 76.947-15.288 138.423v105h390v-105c0-61.476-7.771-100.593-15.287-138.423-7.567-38.082-14.713-74.053-14.713-132.577v-15h-60v-65.542c-1.033-.918-30.165-55.461-105-55.458zm-75 64.763c16.41-21.845 44.099-34.762 75-34.763 30.9-.001 58.587 12.916 75 34.763v56.237h-150zm210.159 86.237c1.142 53.026 8.242 88.763 15.128 123.423 7.567 38.082 14.713 74.053 14.713 132.577v75h-330v-75c0-58.524 7.146-94.495 14.712-132.577 6.886-34.66 13.987-70.397 15.128-123.423h30.16v30h30v-30h150v30h30v-30z" />
      <path d="m301 242h-90c-40.153 0-73.032 31.719-74.909 71.417-9.251 8.247-15.091 20.243-15.091 33.583s5.84 25.336 15.091 33.583c1.877 39.698 34.756 71.417 74.909 71.417h90c40.154 0 73.032-31.719 74.909-71.416 9.251-8.248 15.091-20.244 15.091-33.584s-5.84-25.336-15.091-33.584c-1.877-39.697-34.755-71.416-74.909-71.416zm-90 30h90c19.555 0 36.228 12.542 42.42 30h-174.84c6.192-17.458 22.865-30 42.42-30zm90 150h-90c-19.555 0-36.228-12.542-42.42-30.01h174.84c-6.192 17.468-22.865 30.01-42.42 30.01zm60-75c0 8.271-6.729 15-15 15h-180c-8.271 0-15-6.729-15-15s6.729-15 15-15h180c8.271 0 15 6.729 15 15z" />
    </g>
  </svg>
)
