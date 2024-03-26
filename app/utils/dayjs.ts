import 'dayjs/locale/zh-cn';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.locale('zh-cn')
dayjs.tz.setDefault('Asia/Shanghai')

export default dayjs;