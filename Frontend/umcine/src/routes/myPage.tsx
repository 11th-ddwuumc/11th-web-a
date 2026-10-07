import { createFileRoute } from '@tanstack/react-router'
import { MypagePage  } from '../pages/mypage-page'

export const Route = createFileRoute("/myPage")({
    component: MypagePage,
});
