import { Repository } from 'typeorm';
import { Member } from '../entity/member.entity';
import { Rating } from '../entity/rating.entity';
import { RatingService } from './rating.service';

describe('RatingService (단위 테스트)', () => {
  it('같은 영화에 평점을 중복 등록하면 409와 RATING409_1 예외가 발생한다', async () => {
    const memberRepository = {
      findOneBy: async () => ({ memberId: 1 }),
    };
    const ratingRepository = {
      findOne: async () => ({ ratingId: 10, movieId: 550 }),
    };

    const service = new RatingService(
      ratingRepository as unknown as Repository<Rating>,
      memberRepository as unknown as Repository<Member>,
    );

    await expect(
      service.create(1, { movieId: 550, score: 5 }),
    ).rejects.toMatchObject({ code: 'RATING409_1' });
  });

  it('다른 회원이 작성한 평점을 수정하면 403과 RATING403_1 예외가 발생한다', async () => {
    const memberRepository = {};
    const ratingRepository = {
      findOne: async () => ({ ratingId: 10, member: { memberId: 2 } }),
    };

    const service = new RatingService(
      ratingRepository as unknown as Repository<Rating>,
      memberRepository as unknown as Repository<Member>,
    );

    await expect(service.update(1, 10, { score: 3 })).rejects.toMatchObject({
      code: 'RATING403_1',
    });
  });
});
