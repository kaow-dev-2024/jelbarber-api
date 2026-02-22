require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Branch, Appointment, InventoryItem, Transection } = require('./models');

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function toThaiYearRange() {
  return { start: 2025, end: 2026 };
}

async function seed() {
  const reset = process.env.SEED_RESET === 'true';

  try {
    await sequelize.authenticate();
    await sequelize.sync(reset ? { force: true } : undefined);

    const passwordHash = await bcrypt.hash('admin', 10);

    const [branchMain] = await Branch.findOrCreate({
      where: { name: 'สาขาเมืองทองธานี' },
      defaults: { address: 'คอนโด T10 ถนนป๊อปปูล่า ปากเกร็ด นนทบุรี', phone: '021111111', isActive: true }
    });
    const [branchLatPhrao] = await Branch.findOrCreate({
      where: { name: 'สาขาลาดพร้าว' },
      defaults: { address: 'ลาดพร้าว กรุงเทพฯ', phone: '022222222', isActive: true }
    });
    const [branchRatchada] = await Branch.findOrCreate({
      where: { name: 'สาขารัชดา' },
      defaults: { address: 'รัชดา กรุงเทพฯ', phone: '023333333', isActive: true }
    });
    const branches = [branchMain, branchLatPhrao, branchRatchada];

    const admin = await User.findOrCreate({
      where: { email: 'admin@admin.com' },
      defaults: { passwordHash, name: 'แอดมินระบบ', phone: '0890000001', role: 'admin', isActive: true }
    });

    const employeeNames = ['ช่างบาส', 'ช่างเฟิร์ส', 'ช่างพีท', 'ช่างกอล์ฟ', 'ช่างดรีม', 'ช่างป่าน'];
    const employees = [];
    for (let i = 0; i < employeeNames.length; i += 1) {
      const email = `barber${i + 1}@employee.com`;
      const [row] = await User.findOrCreate({
        where: { email },
        defaults: {
          passwordHash,
          name: employeeNames[i],
          phone: `08900000${String(i + 2).padStart(2, '0')}`,
          role: 'employee',
          isActive: true,
          branchId: randomItem(branches).id
        }
      });
      employees.push(row);
    }

    const usedUserNames = new Set();
    const existingNameRows = await User.findAll({ attributes: ['name'], raw: true });
    for (const row of existingNameRows) {
      if (row.name) {
        usedUserNames.add(row.name);
      }
    }

    const firstNames = ['ธนา', 'พิมพ์', 'เอก', 'นที', 'ก้อง', 'พลอย', 'มิน', 'ภพ', 'ดาว', 'ฟ้า', 'บีม', 'เตย'];
    const lastNames = ['ศรีสุข', 'ใจดี', 'วัฒนา', 'บุญส่ง', 'สกุลไทย', 'วงศ์ดี', 'จันทรา', 'ทองดี'];
    const members = [];
    const memberCount = 3;
    const baseNameCounts = new Map();
    for (let i = 0; i < memberCount; i += 1) {
      const baseName = `คุณ${randomItem(firstNames)} ${randomItem(lastNames)}`;
      let name = baseName;
      if (usedUserNames.has(name)) {
        let index = baseNameCounts.get(baseName) || 0;
        do {
          index += 1;
          name = `${baseName} ${index}`;
        } while (usedUserNames.has(name));
        baseNameCounts.set(baseName, index);
      }
      usedUserNames.add(name);
      const email = `member${String(i + 1).padStart(4, '0')}@member.com`;
      const phone = `08${randomInt(10000000, 99999999)}`;
      const [row] = await User.findOrCreate({
        where: { email },
        defaults: {
          passwordHash,
          name,
          phone,
          role: 'member',
          isActive: true
        }
      });
      members.push(row);
    }

    const inventorySeeds = [
      { sku: 'SKU-HAIRWAX-001', name: 'แว็กซ์จัดแต่งทรงผม', unit: 'กระปุก', cost: 120.0 },
      { sku: 'SKU-SHAMPOO-002', name: 'แชมพูสมุนไพร', unit: 'ขวด', cost: 85.0 },
      { sku: 'SKU-CAPE-003', name: 'ผ้าคลุมตัดผม', unit: 'ผืน', cost: 150.0 },
      { sku: 'SKU-COMB-004', name: 'หวีตัดผม', unit: 'อัน', cost: 35.0 },
      { sku: 'SKU-CLIPPER-005', name: 'ปัตตาเลี่ยน', unit: 'เครื่อง', cost: 1850.0 },
      { sku: 'SKU-SCISSOR-006', name: 'กรรไกรตัดผม', unit: 'อัน', cost: 650.0 }
    ];

    const inventoryTarget = 18;
    const inventoryRows = [];
    for (let i = 0; i < inventoryTarget; i += 1) {
      const item = randomItem(inventorySeeds);
      const branch = randomItem(branches);
      inventoryRows.push({
        branchId: branch.id,
        sku: `${item.sku}-${branch.id}-${String(i + 1).padStart(3, '0')}`,
        name: item.name,
        quantity: randomInt(5, 40),
        unit: item.unit,
        cost: item.cost
      });
    }
    await InventoryItem.bulkCreate(inventoryRows);

    const serviceNotes = ['ตัดผมชาย', 'สระ+ไดร์', 'โกนหนวด', 'ตัด+สระ', 'ทำสีผม'];
    const paymentMethods = ['cash', 'card', 'transfer', 'qr'];
    const appointmentStatuses = ['Booked', 'Successful', 'Cancelled'];
    const categories = [
      { type: 'income', name: 'รายได้ค่าตัดผมชาย' },
      { type: 'income', name: 'รายได้โกนหนวด/กันเครา' },
      { type: 'income', name: 'รายได้สระผม' },
      { type: 'income', name: 'รายได้แพ็กเกจ/สมาชิก' },
      { type: 'income', name: 'รายได้บริการนอกสถานที่' },
      { type: 'income', name: 'รายได้ขายสินค้า (แว็กซ์/โพเมด/แชมพู)' },
      { type: 'income', name: 'รายได้ทิป' },
      { type: 'income', name: 'รายได้อื่นๆ' },
      { type: 'expense', name: 'ต้นทุนสินค้าเพื่อขาย (แว็กซ์/โพเมด/แชมพู)' },
      { type: 'expense', name: 'วัสดุสิ้นเปลือง (ใบมีด/โฟมโกนหนวด/แอลกอฮอล์)' },
      { type: 'expense', name: 'ของใช้ทำความสะอาด/ซักรีด' },
      { type: 'expense', name: 'เงินเดือนพนักงาน' },
      { type: 'expense', name: 'ค่าคอมมิชชั่นช่าง' },
      { type: 'expense', name: 'สวัสดิการ/ประกันสังคม' },
      { type: 'expense', name: 'ค่าเช่าร้าน' },
      { type: 'expense', name: 'ค่าส่วนกลาง/ค่าที่จอดรถ' },
      { type: 'expense', name: 'ค่าไฟ' },
      { type: 'expense', name: 'ค่าน้ำ' },
      { type: 'expense', name: 'ค่าอินเทอร์เน็ต/โทรศัพท์' },
      { type: 'expense', name: 'ค่าซ่อมบำรุงอุปกรณ์' },
      { type: 'expense', name: 'ค่าซ่อมบำรุงร้าน' },
      { type: 'expense', name: 'ค่าโฆษณา/การตลาด' },
      { type: 'expense', name: 'ค่าทำป้าย/สื่อสิ่งพิมพ์' },
      { type: 'expense', name: 'ค่าคอมแพลตฟอร์มจองคิว' },
      { type: 'expense', name: 'ค่าธรรมเนียมธนาคาร/พร้อมเพย์' },
      { type: 'expense', name: 'ค่าธรรมเนียมบัตร/QR' },
      { type: 'expense', name: 'ค่าวัสดุสำนักงาน' },
      { type: 'expense', name: 'ค่าเดินทาง/ขนส่ง' },
      { type: 'expense', name: 'ค่าบริการบัญชี/ที่ปรึกษา' },
      { type: 'expense', name: 'ค่าระบบ POS/Subscription' },
      { type: 'expense', name: 'ภาษี/ค่าธรรมเนียมราชการ' },
      { type: 'expense', name: 'ค่าเสื่อมราคาอุปกรณ์ร้าน' },
      { type: 'expense', name: 'ซื้ออุปกรณ์ถาวร (ปัตตาเลี่ยน/กรรไกร/เก้าอี้)' },
      { type: 'expense', name: 'ปรับปรุง/ตกแต่งร้าน' }
    ];
    const incomeCategories = categories.filter((category) => category.type === 'income');
    const expenseCategories = categories.filter((category) => category.type === 'expense');
    const { start, end } = toThaiYearRange();
    const appointmentTarget = 1000;
    const transectionTarget = 1000;

    let appointmentTotal = 0;
    let transectionTotal = 0;

    while (appointmentTotal < appointmentTarget) {
      const remaining = appointmentTarget - appointmentTotal;
      const batchSize = Math.min(50, remaining);
      const appointments = [];

      for (let i = 0; i < batchSize; i += 1) {
        const year = randomInt(start, end);
        const month = randomInt(0, 11);
        const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
        const day = randomInt(1, daysInMonth);
        const hour = randomInt(10, 17);
        const minute = randomInt(0, 1) === 0 ? 0 : 30;
        const startAt = new Date(Date.UTC(year, month, day, hour, minute, 0));
        const endAt = new Date(Date.UTC(year, month, day, hour, minute + 30, 0));

        const branch = randomItem(branches);
        const member = randomItem(members);
        const employee = randomItem(employees);

        appointments.push({
          branchId: branch.id,
          memberId: member.id,
          employeeId: employee.id,
          startAt,
          endAt,
          status: randomItem(appointmentStatuses),
          notes: randomItem(serviceNotes)
        });
      }

      const created = await Appointment.bulkCreate(appointments, { returning: true });
      appointmentTotal += created.length;
    }

    while (transectionTotal < transectionTarget) {
      const remaining = transectionTarget - transectionTotal;
      const batchSize = Math.min(100, remaining);
      const transections = [];
      for (let i = 0; i < batchSize; i += 1) {
        const year = randomInt(start, end);
        const month = randomInt(0, 11);
        const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
        const day = randomInt(1, daysInMonth);
        const branch = randomItem(branches);
        const type = randomItem(['income', 'expense']);
        const amount = type === 'income' ? randomInt(200, 900) : randomInt(300, 1200);
        const category = type === 'income' ? randomItem(incomeCategories) : randomItem(expenseCategories);
        const notePrefix = type === 'income' ? randomItem(serviceNotes) : 'ค่าใช้จ่ายประจำวัน';

        transections.push({
          type,
          amount,
          category: category.name,
          note: `${notePrefix} (${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')})`,
          occurredAt: new Date(Date.UTC(year, month, day, 18, 0, 0)),
          method: randomItem(['cash', 'card', 'transfer', 'qr']),
          branchId: branch.id
        });
      }
      await Transection.bulkCreate(transections);
      transectionTotal += transections.length;
    }

    console.log('Seed completed');
    console.log(`Branches: ${branches.length}`);
    console.log(`Users: admin=${admin[0].id}, employees=${employees.length}, members=${members.length}`);
    console.log(`Appointments: ${appointmentTotal}`);
    console.log(`Transections: ${transectionTotal}`);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seed();
