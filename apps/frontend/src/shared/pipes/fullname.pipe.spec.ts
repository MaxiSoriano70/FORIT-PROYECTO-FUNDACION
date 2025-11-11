import { FullnamePipe } from "./fullname.pipe";


describe('FullnamePipe', () => {
  it('create an instance', () => {
    const pipe = new FullnamePipe();
    expect(pipe).toBeTruthy();
  });

  fit('should return fullname', () => {
    //SETUP
    const pipe = new FullnamePipe();
    const name = "Luciano";
    const surname = "Lollo";
    //ACT
    const result = pipe.transform(name, surname);
    //ASSERT
    expect(pipe.transform(name, surname)).toBe("Luciano Lollo");
  });
});
